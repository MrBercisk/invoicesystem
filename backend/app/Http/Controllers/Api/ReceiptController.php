<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Receipt\StoreReceiptRequest;
use App\Http\Requests\Receipt\StoreReceiptFromInvoiceRequest;
use App\Http\Requests\Receipt\UpdateReceiptRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Invoice;
use App\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class ReceiptController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Receipt::with(['company', 'client', 'invoice'])
                        ->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->client_id) {
            $query->where('client_id', $request->client_id);
        }
        if ($request->company_id) {
            $query->where('company_id', $request->company_id);
        }
        if ($request->invoice_id) {
            $query->where('invoice_id', $request->invoice_id);
        }
        if ($request->search) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('receipt_number', 'like', "%{$search}%")
                    ->orWhere('payment_for', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($clientQuery) use ($search) {
                        $clientQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('invoice', function ($invoiceQuery) use ($search) {
                        $invoiceQuery->where('invoice_number', 'like', "%{$search}%");
                    });
            });
        }

        return ApiResponse::success($query->paginate(15));
    }

    public function store(StoreReceiptRequest $request): JsonResponse
    {
        $data = $request->validated();

        $receipt = Receipt::create([
            ...$data,
            'receipt_number'       => Receipt::generateNumber($data['company_id']),
            'requires_stamp_duty'  => $data['requires_stamp_duty'] ?? ($data['amount'] >= 5000000),
            'status'               => 'issued',
        ]);

        return ApiResponse::created(
            $receipt->load(['company', 'client', 'invoice'])
        );
    }

    /**
     * Generate kwitansi otomatis dari invoice yang sudah lunas.
     */
    public function storeFromInvoice(StoreReceiptFromInvoiceRequest $request, Invoice $invoice): JsonResponse
    {
        if ($invoice->status !== 'paid') {
            return ApiResponse::error('Kwitansi hanya bisa dibuat dari invoice yang berstatus lunas.');
        }

        $overrides = array_filter(
            $request->validated(),
            fn ($value) => $value !== null
        );

        $receipt = Receipt::createFromInvoice($invoice, $overrides);

        return ApiResponse::created(
            $receipt->load(['company', 'client', 'invoice'])
        );
    }

    public function show(Receipt $receipt): JsonResponse
    {
        return ApiResponse::success($receipt->load(['company', 'client', 'invoice.items']));
    }

    public function update(UpdateReceiptRequest $request, Receipt $receipt): JsonResponse
    {
        $data = $request->validated();

        $receipt->update($data);

        return ApiResponse::success($receipt->load(['company', 'client', 'invoice']));
    }

    public function destroy(Receipt $receipt): JsonResponse
    {
        try {
            $receipt->delete();

            return ApiResponse::message('Deleted successfully');
        } catch (QueryException $e) {
            return ApiResponse::error('Kwitansi tidak bisa dihapus karena masih memiliki data terkait.');
        }
    }

    /**
     * Void kwitansi (bukan hard delete) — untuk kasus kwitansi salah
     * cetak/salah nominal tapi tetap perlu jejak audit.
     */
    public function void(Receipt $receipt): JsonResponse
    {
        $receipt->update(['status' => 'void']);

        return ApiResponse::success($receipt);
    }

    public function pdfUrl(Request $request, Receipt $receipt): JsonResponse
    {
        $request->validate([
            'template' => ['nullable', 'in:minimalis,formal,gradient'],
        ]);

        $template = $request->input('template', 'minimalis');

        $link = $receipt->pdfLink($template);

        return ApiResponse::success([
            'url' => $link['url'],
            'expires_at' => $link['expires_at']->toIso8601String(),
        ]);
    }
}