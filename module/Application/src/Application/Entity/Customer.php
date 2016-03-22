<?php

namespace Application\Entity;

use Doctrine\ORM\Mapping as ORM;

/** @ORM\Entity
  * @ORM\Table(name="customer")
  */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    public $id;
    
    /** @ORM\Column(type="string") */
    public $name;
    
    /** @ORM\Column(type="text") */
    public $address;
    
    /** @ORM\Column(type="string") */
    public $postcode;
    
    /** @ORM\Column(type="string") */
    public $telephone;
    
    /** @ORM\Column(type="string") */
    public $email;
}
