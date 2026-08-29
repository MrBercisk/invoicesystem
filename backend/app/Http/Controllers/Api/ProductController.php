<?php
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
 
class ProductController extends Controller {
    public function index(): JsonResponse {
        return response()->json(Product::latest()->get());
    }
 
    public function store(Request $request): JsonResponse {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'unit'        => 'nullable|string',
        ]);
        return response()->json(Product::create($data), 201);
    }
 
    public function update(Request $request, Product $product): JsonResponse {
        $product->update($request->validate([
            'name'        => 'sometimes|required|string',
            'description' => 'nullable|string',
            'price'       => 'sometimes|numeric|min:0',
            'unit'        => 'nullable|string',
        ]));
        return response()->json($product);
    }
 
    public function destroy(Product $product): JsonResponse {
        $product->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
 
