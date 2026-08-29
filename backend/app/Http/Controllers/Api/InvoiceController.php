<?php
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
 
class InvoiceController extends Controller {
    public function index(Request $request): JsonResponse {
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
 
        return response()->json($query->paginate(15));
    }
 
    public function store(Request $request): JsonResponse {
        $data = $request->validate([
            'company_id'   => 'required|exists:companies,id',
            'client_id'    => 'required|exists:clients,id',
            'invoice_date' => 'required|date',
            'due_date'     => 'required|date|after_or_equal:invoice_date',
            'tax_rate'     => 'nullable|numeric|min:0|max:100',
            'discount'     => 'nullable|numeric|min:0',
            'notes'        => 'nullable|string',
            'terms'        => 'nullable|string',
            'items'        => 'required|array|min:1',
            'items.*.name'     => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.price'    => 'required|numeric|min:0',
            'items.*.unit'     => 'nullable|string',
            'items.*.description' => 'nullable|string',
            'items.*.product_id'  => 'nullable|exists:products,id',
        ]);
 
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
 
        return response()->json($invoice->load(['company', 'client', 'items']), 201);
    }
 
    public function show(Invoice $invoice): JsonResponse {
        return response()->json($invoice->load(['company', 'client', 'items.product']));
    }
 
    public function update(Request $request, Invoice $invoice): JsonResponse {
        $data = $request->validate([
            'company_id'   => 'sometimes|exists:companies,id',
            'client_id'    => 'sometimes|exists:clients,id',
            'invoice_date' => 'sometimes|date',
            'due_date'     => 'sometimes|date',
            'status'       => 'sometimes|in:draft,sent,paid,cancelled',
            'tax_rate'     => 'nullable|numeric',
            'discount'     => 'nullable|numeric|min:0',
            'notes'        => 'nullable|string',
            'terms'        => 'nullable|string',
            'items'        => 'sometimes|array|min:1',
            'items.*.name'     => 'required_with:items|string',
            'items.*.quantity' => 'required_with:items|numeric|min:0.01',
            'items.*.price'    => 'required_with:items|numeric|min:0',
            'items.*.unit'     => 'nullable|string',
            'items.*.description' => 'nullable|string',
            'items.*.product_id'  => 'nullable|exists:products,id',
        ]);
 
        $invoice->update($data);
 
        if (isset($data['items'])) {
            $invoice->items()->delete();
            foreach ($data['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['price'];
                $invoice->items()->create([...$item, 'total' => $itemTotal]);
            }
            $invoice->recalculate();
        }
 
        return response()->json($invoice->load(['company', 'client', 'items']));
    }
 
    public function destroy(Invoice $invoice): JsonResponse {
        $invoice->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
 
    public function updateStatus(Request $request, Invoice $invoice): JsonResponse {
        $request->validate(['status' => 'required|in:draft,sent,paid,cancelled']);
        $invoice->update(['status' => $request->status]);
        return response()->json($invoice);
    }
}
