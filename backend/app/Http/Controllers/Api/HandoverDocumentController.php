<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HandoverDocument\StoreHandoverDocumentRequest;
use App\Http\Requests\HandoverDocument\UpdateHandoverDocumentRequest;
use App\Http\Requests\HandoverDocument\UpdateHandoverStatusRequest;
use App\Http\Responses\ApiResponse;
use App\Models\HandoverDocument;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class HandoverDocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = HandoverDocument::with(['company', 'client', 'invoice', 'items'])
            ->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }
        if ($request->client_id) {
            $query->where('client_id', $request->client_id);
        }
        if ($request->invoice_id) {
            $query->where('invoice_id', $request->invoice_id);
        }
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('document_number', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($clientQuery) use ($search) {
                        $clientQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        return ApiResponse::success($query->paginate(15));
    }

    public function store(StoreHandoverDocumentRequest $request): JsonResponse
    {
        $data = $request->validated();

        $document = HandoverDocument::create([
            ...$data,
            'document_number' => HandoverDocument::generateNumber($data['company_id']),
            'status' => 'draft',
        ]);

        foreach ($data['items'] as $index => $item) {
            $document->items()->create([
                ...$item,
                'sort_order' => $index,
            ]);
        }

        return ApiResponse::created(
            $document->load(['company', 'client', 'invoice', 'items'])
        );
    }

    public function show(HandoverDocument $handoverDocument): JsonResponse
    {
        return ApiResponse::success(
            $handoverDocument->load(['company', 'client', 'invoice', 'items'])
        );
    }

    public function update(UpdateHandoverDocumentRequest $request, HandoverDocument $handoverDocument): JsonResponse
    {
        $data = $request->validated();

        $handoverDocument->update($data);

        if (isset($data['items'])) {
            $handoverDocument->items()->delete();
            foreach ($data['items'] as $index => $item) {
                $handoverDocument->items()->create([
                    ...$item,
                    'sort_order' => $index,
                ]);
            }
        }

        return ApiResponse::success(
            $handoverDocument->load(['company', 'client', 'invoice', 'items'])
        );
    }

    public function destroy(HandoverDocument $handoverDocument): JsonResponse
    {
        try {
            $handoverDocument->delete();

            return ApiResponse::message('Deleted successfully');
        } catch (QueryException $e) {
            return ApiResponse::error('Dokumen tidak bisa dihapus karena masih memiliki data terkait.');
        }
    }

    public function updateStatus(UpdateHandoverStatusRequest $request, HandoverDocument $handoverDocument): JsonResponse
    {
        $handoverDocument->update(['status' => $request->validated('status')]);

        return ApiResponse::success($handoverDocument);
    }

    public function pdfUrl(Request $request, HandoverDocument $handoverDocument): JsonResponse
    {
        $request->validate([
            'template' => ['nullable', 'in:minimalis,formal,gradient'],
        ]);

        $template = $request->input('template', 'minimalis');

        $link = $handoverDocument->pdfLink($template);

        return ApiResponse::success([
            'url' => $link['url'],
            'expires_at' => $link['expires_at']->toIso8601String(),
        ]);
    }
}