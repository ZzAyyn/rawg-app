<x-mail::message>
# Hey {{ $user->name }}! 

Here are your personalised game recommendations for this week.

@foreach($recommendations as $recommendation)
<x-mail::panel>
**{{ $recommendation['game']['name'] }}**

Rating: {{ $recommendation['game']['rating'] }} / 5

{{ $recommendation['explanation'] }}

@if($recommendation['game']['background_image'])
<img src="{{ $recommendation['game']['background_image'] }}" alt="{{ $recommendation['game']['name'] }}" style="width:100%;border-radius:8px;margin-top:8px;">
@endif
</x-mail::panel>

@endforeach

<x-mail::button :url="url('http://localhost:3000/home')">
Browse More Games
</x-mail::button>

Thanks for using RGVT!

---
<small>Don't want these emails? <a href="{{ $unsubscribeUrl }}">Unsubscribe here</a></small>

</x-mail::message>