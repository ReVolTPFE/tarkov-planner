<?php

namespace App\Controller;

use App\Repository\MapRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class MapController extends AbstractController
{
    public function __construct(private readonly MapRepository $mapRepository)
    {
    }

    #[Route('/maps', name: 'app_get_maps', methods: ['GET'])]
    public function getMaps(): JsonResponse
    {
        $maps = $this->mapRepository->findAll();

        return $this->json($maps, 200, [], ['groups' => ['map:read']]);
    }
}
