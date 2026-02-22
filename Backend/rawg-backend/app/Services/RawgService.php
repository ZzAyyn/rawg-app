<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;


class RawgService
{
    protected $apiKey;
    protected $baseUrl;
    
    public function __construct() {
        $this->apiKey = config("services.rawg.key");
        $this->baseUrl = config("services.rawg.base_url");
    }

    // private function http() {
    //     return Http::withoutVerifying();
    // }

    // no point in using above func, error fikus

    public function getGames($page = 1, $pageSize = 20, $search = null, $ordering = null) {
        $params = [
            'key' => $this->apiKey,
            'page' => $page,
            'page_size'=> $pageSize,
        ];

        if ($search) {
            $params['search'] = $search;
        }

        if ($ordering) {
            $params['ordering'] = $ordering;
        }

        try {
            $response = Http::get("{$this->baseUrl}/games", $params);

            if ($response -> successful()) {
                return $response -> json();
            }

            Log::error("RAWG API ERROR OCCURED: " . $response->body());
            return null;

        } catch (\Exception $e) {
            Log::error('RAWG API EXCEPTION: ' . $e->getMessage());
            return null;
        }

    }

    public function getGame($id) {
        return Cache::remember("game_{$id}", 3600, function () use ($id){
            try {

                $response = Http::get("{$this->baseUrl}/games/{$id}", [
                    'key' => $this->apiKey,
                ]);

                if ($response -> successful()) {
                    return $response -> json();
                }

                Log::error("RAWG API ERROR OCCURED: " . $response->body());
                return null;
                
            } catch (\Exception $e) {
                Log::error('RAWG API EXCEPTION: '. $e->getMessage());
                return null;
            }
        });
    }

    public function getGameScreenshots($gameId) {
        try {
            $response  = Http::get("{$this->baseUrl}/games/{$gameId}/screenshots", [
                'key' => $this->apiKey,
            ]);

            if ($response -> successful()) {
                return $response -> json();
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error('RAWG API EXCEPTION: '. $e->getMessage());
            return null;
        }
    }

    public function getGenres() {
        return Cache::remember('genres', 86400, function () {
            try {
                $response = Http::get("{$this->baseUrl}/genres", [
                    'key'=> $this->apiKey,
                ]);

                if ($response -> successful()) {
                    return $response -> json();
                }
                return null;
            } catch (\Exception $e) {
                Log::error('RAWG API EXCEPTION: '. $e->getMessage());
                return null;
            }
        });
    }

    public function getPlatforms()
    {
        return Cache::remember('platforms', 86400, function () {
            try {
                $response = Http::get("{$this->baseUrl}/platforms", [
                    'key' => $this->apiKey,
                ]);

                if ($response->successful()) {
                    return $response->json();
                }
                
                return null;
                
            } catch (\Exception $e) {
                Log::error('RAWG API Exception: ' . $e->getMessage());
                return null;
            }
        });
    }
}