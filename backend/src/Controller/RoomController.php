<?php

namespace App\Controller;

use App\Entity\Room;
use App\Repository\RoomRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class RoomController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly RoomRepository $roomRepository
    )
    {
    }

    #[Route('/rooms', name: 'app_post_room', methods: ['POST'])]
    public function createRoom(): JsonResponse
    {
        $room = new Room();

        $this->entityManager->persist($room);
        $this->entityManager->flush();

        return $this->json($room, 201, [], ['groups' => ['room:read']]);
    }

    #[Route('/rooms/{roomUuid}', name: 'app_get_room', methods: ['GET'])]
    public function getRoom(string $roomUuid): JsonResponse
    {
        $room = $this->roomRepository->findOneBy(['uuid' => $roomUuid]);

        if (!$room) {
            return $this->json([
                'error' => 'No room found with this UUID.'
            ], 404);
        }

        return $this->json($room, 201, [], ['groups' => ['room:read']]);
    }
}
