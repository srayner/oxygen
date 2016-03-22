<?php

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractRestfulController;
use Zend\View\Model\ViewModel;

class TestController extends AbstractRestfulController
{
    public function getList()
    {
        // TODO: move this to a service
        $em = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $data = $em->getRepository('Application\Entity\Customer')->findAll();
        
        // TODO: should be a json model
        $view = new ViewModel();
        $view->setTerminal(true);
        $view->setVariables(array(
            'data' => $data
        ));
        
        return $view;
    }
}