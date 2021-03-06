<?php
use Respect\Validation\Validator as DataValidator;
DataValidator::with('CustomValidations', true);

/**
 * @api {post} /ticket/edit-comment Edit a comment
 * @apiVersion 4.4.0
 *
 * @apiName Edit comment
 *
 * @apiGroup Ticket
 *
 * @apiDescription This path edit a comment.
 *
 * @apiPermission user
 *
 * @apiParam {String} content The new content of the comment.
 * @apiParam {Number} ticketEventId The id of the ticket event.
 * @apiParam {Number} ticketNumber The id of the ticket number.
 *
 * @apiUse NO_PERMISSION
 * @apiUse INVALID_CONENT
 *
 * @apiSuccess {Object} data Empty object
 *
 */

class EditCommentController extends Controller {
    const PATH = '/edit-comment';
    const METHOD = 'POST';

    public function validations() {
        return [
            'permission' => 'user',
            'requestData' => [
                'content' => [
                    'validation' => DataValidator::length(10, 5000),
                    'error' => ERRORS::INVALID_CONTENT
                ]
            ]
        ];
    }

    public function handler() {
        $user = Controller::getLoggedUser();
        $newcontent = Controller::request('content');

        $ticketevent = Ticketevent::getTicketEvent(Controller::request('ticketEventId'));
        $ticket = Ticket::getByTicketNumber(Controller::request('ticketNumber'));

        if(!Controller::isStaffLogged() && ($user->id !== $ticketevent->authorUserId && $user->id !== $ticket->authorId )){
            throw new RequestException(ERRORS::NO_PERMISSION);
        }

        if(!$ticketevent->isNull()){
            $ticketevent->content = $newcontent;
            $ticketevent->editedContent = true;
            $ticketevent->store();
        }else{
            $ticket->content = $newcontent;
            $ticket->editedContent = true;
            $ticket->store();
        }

        
        Response::respondSuccess();
    }
}
