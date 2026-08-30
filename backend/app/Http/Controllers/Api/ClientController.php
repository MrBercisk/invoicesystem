<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Http\Responses\ApiResponse;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\QueryException;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        return ApiResponse::success(Client::latest()->get());
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        $client = Client::create($request->validated());

        return ApiResponse::created($client);
    }

    public function show(Client $client): JsonResponse
    {
        return ApiResponse::success($client->load('invoices'));
    }

    public function update(UpdateClientRequest $request, Client $client): JsonResponse
    {
        $client->update($request->validated());

        return ApiResponse::success($client);
    }

    public function destroy(Client $client): JsonResponse
    {
        try {
            $client->delete();

            return ApiResponse::message('Deleted successfully');
        } catch (QueryException $e) {
            return ApiResponse::error('Client tidak bisa dihapus karena masih memiliki data terkait (invoice).');
        }
    }
}