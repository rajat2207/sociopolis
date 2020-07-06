import { get } from "mongoose";

//method to submit form data for new post using AJAX
let createPost=function(){
    let newPostForm=$('#new-post-form');
    
    newPostForm.submit(function(e){
        e.preventDefault();

        $.ajax({
            type:'post',
            url:'/posts/create',
            data: newPostForm.serialize(),
            success: function(data){
                let newPost=newPostDOM(data.data.post);
                $('#posts-list-container>ul').prepend(newPost);
                deletePost($('.delete-post-button', newPost));
            },
            error: function(error){
                console.log(error.responseText);
            }
        });

    });

}

//method to create a post in DOM
let newPostDOM = function(post){
    return $(`<li id="post-${post._id}"> 
                <p>   
                    <small>
                        <a class="delete-post" href="posts/destroy/${ post._id }">X</a>
                    </small>
                    ${post.content}<br>
                    <small>${ post.user.name }</small>
                </p>
                <div class="post-comments">
                        <form action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Type here To Add Comment...." required>
                            <input type="hidden" name="post" value="<%= post._id %>">
                            <button type="submit">Add Comment</button>
                        </form> 
                    <div class="post-comments-list">
                        <ul id="post-comments-${ post._id }">
                        </ul>
                    </div>
                </div>
            </li>`)
}

//method to delete a post from DOM
let deletePost=function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();
        $.ajax({
            type: get,
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
            },
            error: function (error) {
                console.log(error.responseText);
            }
        });
    });
}

let deletePostButtons= $('.delete-post-button');

for(let i=0;i<deletePostButtons.length;i++){
    deletePost(deletePostButtons[i]);
}

createPost();