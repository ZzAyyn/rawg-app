<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Game;

class RGVTseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $apiKey = config('services.rawg.key');
        $baseUrl = config('services.rawg.base_url');
        $pagesToFetch = 25;

        $this -> command -> info('Seeding games from API...');

        for ($page = 1; $page <= $pagesToFetch; $page++) {
            $this -> command -> info("Fetching page {$page}...");

            try {
                $response = Http::get("{$baseUrl}/games", [
                    'key' => $apiKey,
                    'page' => $page,
                    'page_size' => 20,
                    'ordering' => '-rating',
                ]);

                if (!$response -> successful()) {
                    $this -> command -> error ("Failed to fetch page {$page}");
                    continue;
                }

                $games = $response -> json()['results'] ?? [];

                foreach ($games as $gameData) {
                    $detailResponse = Http::get("{$baseUrl}/games/{$gameData['slug']}", [
                        'key' => $apiKey,
                    ]);

                    $description = null;
                    if ($detailResponse -> successful()) {
                        $description = $detailResponse -> json()['description_raw'] ?? null;
                    }

                    Game::updateOrCreate(
                        ['rawg_id' => $gameData['id']],
                        [
                            'name' => $gameData['name'],
                            'slug' => $gameData['slug'],
                            'description' => $description,
                            'background_image' => $gameData['background_image'] ?? null,
                            'rating' => $gameData['rating'] ?? null,
                            'released' => !empty($gameData['released']) ? $gameData['released'] : null,
                            'platforms' => $gameData['platforms'] ?? null,
                            'genres' => $gameData['genres'] ?? null,
                        ]
                    );

                    $this -> command -> line("  {$gameData['name']}");
                    usleep(25000);
                }
            } catch (\Exception $e) {
                $this -> command -> error("Exception on page {$page}: " . $e -> getMessage());
            }
        }
        
        $this -> command -> info('Seeding Done! Total games seeded: ' . Game::count());
    }
}
