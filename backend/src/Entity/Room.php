<?php

namespace App\Entity;

use App\Repository\RoomRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: RoomRepository::class)]
class Room
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['room:read'])]
    private ?int $id = null;

    #[ORM\Column(type: Types::GUID)]
    #[Groups(['room:read'])]
    private ?string $uuid;

    #[ORM\Column]
    #[Groups(['room:read'])]
    private ?\DateTimeImmutable $createdAt;

    /**
     * @var Collection<int, Drawing>
     */
    #[ORM\OneToMany(targetEntity: Drawing::class, mappedBy: 'room')]
    private Collection $drawings;

    public function __construct()
    {
        $this->uuid = Uuid::uuid4()->toString();
        $this->createdAt = new \DateTimeImmutable();
        $this->drawings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUuid(): ?string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): static
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection<int, Drawing>
     */
    public function getDrawings(): Collection
    {
        return $this->drawings;
    }

    public function addDrawing(Drawing $drawing): static
    {
        if (!$this->drawings->contains($drawing)) {
            $this->drawings->add($drawing);
            $drawing->setRoom($this);
        }

        return $this;
    }

    public function removeDrawing(Drawing $drawing): static
    {
        if ($this->drawings->removeElement($drawing)) {
            // set the owning side to null (unless already changed)
            if ($drawing->getRoom() === $this) {
                $drawing->setRoom(null);
            }
        }

        return $this;
    }
}
