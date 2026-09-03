@if($document->status === 'draft')
    <div class="watermark">
        <div class="watermark-inner watermark-draft">DRAFT</div>
    </div>
@elseif($document->status === 'cancelled')
    <div class="watermark">
        <div class="watermark-inner watermark-cancelled">DIBATALKAN</div>
    </div>
@endif