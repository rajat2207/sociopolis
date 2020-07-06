import { get } from "mongoose";

let createComment=function(){
    let newCommentForm=$('#new-comment-form');
    
    newCommentForm.submit(function(e){
        e.preventDefault();

        $.ajax({
            type:'post',
            url:'/comments/create',
            data: newCommentForm.serialize(),
            success: function(data){
                let newComment=newCommentDOM(data.data.comment);
                $('#posts-comments-list>ul').prepend(newComment);
                deleteComment($('.delete-comment-button', newComment));
            },
            error: function(error){
                console.log(error.responseText);
            }
        });

    });

}


let newCommentDOM = function(comment){
    return $(`<li id="comment-${ comment._id }">
                <p>
                    <small>
                        <a href="comments/destroy/${ comment.id }">X</a>
                    </small>
                    ${ comment.content }
                    <br>
                    <small>
                        ${ comment.user.name }
                    </small>
                </p>
            </li>`)
}

let deleteComment=function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();
        $.ajax({
            type: get,
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#comment-${data.data.comment_id}`).remove();
            },
            error: function (error) {
                console.log(error.responseText);
            }
        });
    });
}

let deleteCommentButtons= $('.delete-comment-button');

for(let i=0;i<deleteCommentButtons.length;i++){
    deleteComment(deleteCommentButtons[i]);
}

createComment();