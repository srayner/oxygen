<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;

class AbstractRestController extends AbstractRestfulController
{
    protected $em;
    
    public function __construct($em)
    {
        $this->em = $em;
    }
}
