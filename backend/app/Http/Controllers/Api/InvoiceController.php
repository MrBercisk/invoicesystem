<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceStatusRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['company', 'client', 'items'])
                        ->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->client_id) {
            $query->where('client_id', $request->client_id);
        }
        if ($request->search) {
            $query->where('invoice_number', 'like', "%{$request->search}%");
        }

        return ApiResponse::success($query->paginate(15));
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $data = $request->validated();

        $invoice = Invoice::create([
            ...$data,
            'invoice_number' => Invoice::generateNumber(),
            'status'         => 'draft',
            'subtotal'       => 0,
            'tax_amount'     => 0,
            'total'          => 0,
        ]);

        foreach ($data['items'] as $item) {
            $itemTotal = $item['quantity'] * $item['price'];
            $invoice->items()->create([...$item, 'total' => $itemTotal]);
        }

        $invoice->recalculate();

        return ApiResponse::created($invoice->load(['company', 'client', 'items']));
    }

    public function show(Invoice $invoice): JsonResponse
    {
        return ApiResponse::success($invoice->load(['company', 'client', 'items.product']));
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): JsonResponse
    {
        $data = $request->validated();

        $invoice->update($data);

        if (isset($data['items'])) {
            $invoice->items()->delete();
            foreach ($data['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['price'];
                $invoice->items()->create([...$item, 'total' => $itemTotal]);
            }
            $invoice->recalculate();
        }

        return ApiResponse::success($invoice->load(['company', 'client', 'items']));
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        try {
            $invoice->delete();

            return ApiResponse::message('Deleted successfully');
        } catch (QueryException $e) {
            return ApiResponse::error('Invoice tidak bisa dihapus karena masih memiliki data terkait.');
        }
    }

    public function updateStatus(UpdateInvoiceStatusRequest $request, Invoice $invoice): JsonResponse
    {
        $invoice->update(['status' => $request->validated('status')]);

        return ApiResponse::success($invoice);
    }
}