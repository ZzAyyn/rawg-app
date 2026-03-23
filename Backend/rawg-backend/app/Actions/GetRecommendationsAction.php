<?php

namespace App\Actions;

use App\Models\User;
use App\Models\Game;

class GetRecommendationsAction {
    public function handle(User $user): array {
        $favourites = $user -> favourites() -> with('game') -> get();

        $reviews = $user -> reviews() -> with('game') -> where('rating', '>=', 7) -> get();

        $knownGameIds = collect();
        
        $knownGameIds = $knownGameIds -> merge (
            $favourites -> pluck('game_id')
        );
        
        $knownGameIds = $knownGameIds -> merge (
            $reviews -> pluck('game_id')
        );

        $favouriteGenres = $favourites 
            -> pluck('game.genres')
            -> flatten(1)
            -> pluck('slug')
            -> filter()
            -> countBy()
            -> sortDesc();
            
        $reviewGenres = $reviews 
            -> pluck('game.genres')
            -> flatten(1)
            -> pluck('slug')
            -> filter()
            -> countBy()
            -> sortDesc();

        if($favouriteGenres -> isEmpty() && $reviewGenres->isEmpty()) {
            return $this -> getColdStartRecommendations();
        }

        $candidateGames = Game::whereNotIn('id', $knownGameIds)
            ->whereNotNull('genres')
            ->get();
        
        $scored = $candidateGames -> map(function (Game $game) use ($favouriteGenres, $reviewGenres) {
            $result = $this -> scoreGame($game, $favouriteGenres, $reviewGenres);
            return $result;
        })
        -> filter(fn($result) => $result['score'] > 0)
        -> sortByDesc('score')
        -> take(10)
        -> values();

        return $scored -> toArray();

    }

    public function scoreGame(Game $game, $favouriteGenres, $reviewGenres): array {
        $score = 0;
        $reasons = [];

        $gameGenres = collect($game -> genres) -> pluck('slug');

        foreach ($gameGenres as $genreSlug) {
            if ($favouriteGenres -> has($genreSlug)) {
                $score += $favouriteGenres[$genreSlug] * 2;
                $reasons[] = $genreSlug;
            }

            if ($reviewGenres -> has($genreSlug)) {
                $score += $reviewGenres[$genreSlug];
            }
        }

        $explanation = $this -> buildExplanation($reasons, $favouriteGenres, $reviewGenres);

        return [
            'game' => $game,
            'score' => $score,
            'explanation' => $explanation,
        ];
    }

    private function buildExplanation(array $matchedGenres, $favouriteGenres, $reviewGenres): string {
        if (!empty($matchedGenres)) {
            $genreNames = array_map(fn($slug) => ucfirst($slug), array_unique($matchedGenres));
            $genreList = implode(' and ', array_slice($genreNames, 0, 2));
            return "Because you enjoy {$genreList} games";
        }

        if ($reviewGenres -> isNotEmpty()) {
            $topGenre = ucfirst($reviewGenres -> keys() -> first());
            return "Based on your highly rated {$topGenre} games";
        }

        return "Popular among users with similar taste";
    }

    public function getColdStartRecommendations(): array {
        return Game::orderBy('rating', 'desc')
            -> take(10)
            -> get()
            -> map(fn($game) => [
                'game' => $game,
                'score' => $game -> rating,
                'explanation' => 'Trending this week based on overall ratings'
            ])
            -> values()
            -> toArray();
    }
}