@if($invoice->status === 'draft')
    <div class="watermark">
        <div class="watermark-inner watermark-draft">DRAFT</div>
    </div>
@elseif($invoice->status === 'paid')
    <div class="watermark">
        <div class="watermark-inner watermark-paid">LUNAS</div>
    </div>
@elseif($invoice->status === 'cancelled')
    <div class="watermark">
        <div class="watermark-inner watermark-cancelled">DIBATALKAN</div>
    </div>
@endif