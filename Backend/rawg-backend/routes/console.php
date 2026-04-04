<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('recommendations:send-weekly')
    -> weeklyOn(1, '9:00')
    -> timezone('Asia/Colombo');
