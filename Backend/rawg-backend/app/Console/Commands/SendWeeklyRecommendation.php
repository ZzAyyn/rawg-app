<?php

namespace App\Console\Commands;

use App\Actions\GetRecommendationsAction;
use App\Mail\WeeklyRecommendationsMail;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class SendWeeklyRecommendation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'recommendations:send-weekly';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send game recommendations to subscribed users.';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $users = User::where('email_notifications', true) -> get();
        $this -> info("Sending recommendations to {$users->count()} users...");

        $action = new GetRecommendationsAction();

        foreach ($users as $user) {
            try {
                if (!$user -> unsubscribe_token) {
                    $user -> update([
                        'unsubscribe_token' => Str::random(32),
                    ]);
                }
    
                $recommendations = $action -> handle($user);
    
                Mail::to($user -> email) -> send(
                    new WeeklyRecommendationsMail($user, $recommendations)
                );
    
                $this -> info("Sent to {$user->email}");
    
                sleep(1);
            } catch (\Exception $e) {
                $this -> error(" Failed to send to {$user->email}: {$e -> getMessage()}");
            }
        }

        $this -> info('Weekly recommendations sent successfully!');

    }
}
