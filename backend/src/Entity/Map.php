<?php

namespace App\Entity;

use App\Repository\MapRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: MapRepository::class)]
class Map
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['map:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['map:read'])]
    private ?string $slug = null;

    #[ORM\Column(length: 255)]
    #[Groups(['map:read'])]
    private ?string $image = null;

    /**
     * @var Collection<int, Drawing>
     */
    #[ORM\OneToMany(targetEntity: Drawing::class, mappedBy: 'map')]
    private Collection $drawings;

    public function __construct()
    {
        $this->drawings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): static
    {
        $this->image = $image;

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
            $drawing->setMap($this);
        }

        return $this;
    }

    public function removeDrawing(Drawing $drawing): static
    {
        if ($this->drawings->removeElement($drawing)) {
            // set the owning side to null (unless already changed)
            if ($drawing->getMap() === $this) {
                $drawing->setMap(null);
            }
        }

        return $this;
    }
}
