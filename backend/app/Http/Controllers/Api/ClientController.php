<?php
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
 
class ClientController extends Controller {
    public function index(): JsonResponse {
        return response()->json(Client::latest()->get());
    }
 
    public function store(Request $request): JsonResponse {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'nullable|email',
            'phone'    => 'nullable|string',
            'address'  => 'nullable|string',
            'city'     => 'nullable|string',
            'country'  => 'nullable|string',
            'npwp'     => 'nullable|string',
            'pic_name' => 'nullable|string',
        ]);
        return response()->json(Client::create($data), 201);
    }
 
    public function show(Client $client): JsonResponse {
        return response()->json($client->load('invoices'));
    }
 
    public function update(Request $request, Client $client): JsonResponse {
        $client->update($request->validate([
            'name'     => 'sometimes|required|string',
            'email'    => 'nullable|email',
            'phone'    => 'nullable|string',
            'address'  => 'nullable|string',
            'city'     => 'nullable|string',
            'country'  => 'nullable|string',
            'npwp'     => 'nullable|string',
            'pic_name' => 'nullable|string',
        ]));
        return response()->json($client);
    }
 
    public function destroy(Client $client): JsonResponse {
        $client->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }
}
