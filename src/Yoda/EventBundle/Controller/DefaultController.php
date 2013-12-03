<?php

namespace Yoda\EventBundle\Controller;

class DefaultController extends Controller
{
    public function indexAction($count, $firstName)
    {
        $this->container->getParameter('database_name');

        $em = $this->getDoctrine()->getManager();
        $repo = $em->getRepository('EventBundle:Event');

        $event = $repo->findOneBy(array(
            'name' => 'Darth\'s Birthday Party!',
        ));

        return $this->render('EventBundle:Default:index.html.twig', array(
            'name' => $firstName,
            'count' => $count,
            'event' => $event,
        ));
    }
}
