<?php

namespace Yoda\EventBundle\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

use Yoda\EventBundle\Entity\Event;
use Yoda\EventBundle\Form\EventType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\Response;

/**
 * Event controller.
 *
 */
class EventController extends Controller
{
    /**
     * Lists all Event entities.
     *
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('EventBundle:Event')
            ->getUpcomingEvents()
        ;

        return array(
            'entities' => $entities,
        );
    }

    /**
     * Finds and displays a Event entity.
     *
     */
    public function showAction($slug)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('EventBundle:Event')
            ->findOneBy(array('slug' => $slug));

        if (!$entity) {
            throw new \Yoda\EventBundle\Exception\EventNotFoundException();
        }

        $deleteForm = $this->createDeleteForm($entity->getId());

        return $this->render('EventBundle:Event:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to create a new Event entity.
     *
     */
    public function newAction()
    {
        $entity = new Event();
        $form   = $this->createForm(new EventType(), $entity);

        return $this->render('EventBundle:Event:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Creates a new Event entity.
     *
     */
    public function createAction(Request $request)
    {
        $entity  = new Event();
        $form = $this->createForm(new EventType(), $entity);
        $form->handleRequest($request);
        $isJson = $request->getRequestFormat() == 'json';

        if ($form->isValid()) {
            // this works
            $entity->setOwner($this->getUser());

            // if we only have this, it would *not* work
            $events = $this->getUser()->getEvents();
            $events[] = $entity;
            $this->getUser()->setEvents($events);

            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            $url = $this->generateUrl('event_show', array('slug' => $entity->getSlug()));

            // hackish JSON endpoint
            if ($isJson) {
                return new JsonResponse(array(
                    'success' => true,
                    'redirect_url' => $url,
                ));
            }

            $request->getSession()->getFlashBag()->add('success', 'Event saved!');

            return $this->redirect($url);
        }

        if ($isJson) {
            // a very cheap/ugly JSON endpoint that actually returns the HTML form
            $data = array(
                'success' => false,
                'form' => $this->renderView('EventBundle:Event:_form.html.twig', array(
                    'form' => $form->createView(),
                    'entity' => $entity
                )),
            );

            return new JsonResponse($data);
        }

        return $this->render('EventBundle:Event:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing Event entity.
     *
     */
    public function editAction($id, Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('EventBundle:Event')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $this->checkOwnerSecurity($entity);

        $editForm = $this->createForm(new EventType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        if ($request->getRequestFormat() == 'json') {
            // a very cheap/ugly JSON endpoint that actually returns the HTML form
            $data = array(
                'form' => $this->renderView('EventBundle:Event:_form.html.twig', array(
                    'form' => $editForm->createView(),
                    'entity' => $entity
                ))
            );

            return new JsonResponse($data);
        }

        return $this->render('EventBundle:Event:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Event entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('EventBundle:Event')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Event entity.');
        }

        $this->checkOwnerSecurity($entity);

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new EventType(), $entity);
        $editForm->handleRequest($request);

        $isJson = $request->getRequestFormat() == 'json';

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            // hackish JSON endpoint
            if ($isJson) {
                return new JsonResponse(array(
                    'success' => true,
                    'event_html' => $this->renderView('EventBundle:Event:_event.html.twig', array(
                        'entity' => $entity
                    )),
                ));
            }

            $request->getSession()->getFlashBag()->add('success', 'Event saved!');

            return $this->redirect($this->generateUrl('event_edit', array('id' => $id)));
        }

        if ($isJson) {
            // a very cheap/ugly JSON endpoint that actually returns the HTML form
            $data = array(
                'success' => false,
                'form' => $this->renderView('EventBundle:Event:_form.html.twig', array(
                    'form' => $editForm->createView(),
                    'entity' => $entity
                )),
            );

            return new JsonResponse($data);
        }

        return $this->render('EventBundle:Event:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a Event entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('EventBundle:Event')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Event entity.');
            }

            $this->checkOwnerSecurity($entity);

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('event'));
    }

    public function attendAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        /** @var $event \Yoda\EventBundle\Entity\Event */
        $event = $em->getRepository('EventBundle:Event')->find($id);

        if (!$event) {
            throw $this->createNotFoundException('No event found for id '.$id);
        }

        if (!$event->hasAttendee($this->getUser())) {
            $event->getAttendees()->add($this->getUser());
        }

        $em->persist($event);
        $em->flush();

        if ($this->getRequest()->getRequestFormat() == 'json') {
            return $this->createAttendingJson(true);
        }

        return $this->redirect($this->generateUrl('event_show', array(
            'slug' => $event->getSlug()
        )));
    }

    public function unattendAction($id)
    {
        $em = $this->getDoctrine()->getManager();
        /** @var $event \Yoda\EventBundle\Entity\Event */
        $event = $em->getRepository('EventBundle:Event')->find($id);

        if (!$event) {
            throw $this->createNotFoundException('No event found for id '.$id);
        }

        if ($event->hasAttendee($this->getUser())) {
            $event->getAttendees()->removeElement($this->getUser());
        }

        $em->persist($event);
        $em->flush();

        if ($this->getRequest()->getRequestFormat() == 'json') {
            return $this->createAttendingJson(false);
        }

        return $this->redirect($this->generateUrl('event_show', array(
            'slug' => $event->getSlug()
        )));
    }

    /**
     * @Template("EventBundle:Event:_events.html.twig")
     * @return array
     */
    public function _upcomingEventsAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('EventBundle:Event')
            ->getUpcomingEvents()
        ;

        return array(
            'entities' => $entities,
        );
    }

    /**
     * @param bool $attending
     * @return \Symfony\Component\HttpFoundation\Response
     */
    private function createAttendingJson($attending)
    {
        $data = array(
            'attending' => $attending
        );

        $response = new Response(json_encode($data));

        return $response;
    }

    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }

    /**
     * Simple function to enforce security - should be abstracted into a voter
     * Simple function to enforce security - should be abstracted into a voter
     *
     * @param Event $event
     * @throws \Symfony\Component\Security\Core\Exception\AccessDeniedException
     */
    private function checkOwnerSecurity(Event $event)
    {
        $user = $this->getUser();

        if ($this->get('security.context')->isGranted('ROLE_ADMIN')) {
            return;
        }

        if ($user == $event->getOwner()) {
            return;
        }

        throw new AccessDeniedException('You are not the owner!!!');
    }
}
