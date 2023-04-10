import React, { useEffect, useRef, useState } from 'react';
import PostList from './PostList';
import PostCreate from './PostCreate';
import PostShow from './PostShow';
import PostEdit from './PostEdit';

export interface PostType {
  id: number;
  title: string;
  content?: string;
  published: boolean;
}

const Post = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostType | null>(null);
  const host = 'http://localhost:3001';

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const res = await fetch(`${host}/posts`);
    setPosts(await res.json());
  }

  async function appendPost(post: PostType) {
    setPosts((prevPosts) => [...prevPosts, post]);
  }

  async function handleDelete(post_id: number) {
    const res = await fetch(`${host}/posts/${post_id}`, {
      method: 'DELETE',
    });

    setPosts((prevPosts) => {
      return prevPosts.filter(({ id }) => id !== post_id);
    });
  }

  async function handleSelectedPost(post_id: number) {
    const res = await fetch(`${host}/posts/${post_id}`);
    console.log(await res.json());

    const selected_post = posts.find(({ id }) => id === post_id);
    if (!selected_post) return;
    setSelectedPost(selected_post);
  }

  function handleUpdatePost(updated_post: PostType) {
    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === updated_post.id) {
          return updated_post;
        }
        return post;
      });
    });
  }
  function handleCancel() {
    setSelectedPost(null);
  }

  const formRef = useRef<HTMLFormElement>(null);
  async function handleFileSubmit(e: any) {
    e.preventDefault();

    if (!formRef.current) return; // log error

    const formData = new FormData(formRef.current);
    const res = await fetch(`${host}/files`, {
      method: 'POST',
      body: formData,
    });

    console.log(await res.json());
  }
  return (
    <div className="flex gap-12 border border-red-400 p-12 text-left">
      <form ref={formRef} onSubmit={handleFileSubmit}>
        <input type="file" name="image" />
        <button type="submit">Submit</button>
      </form>
      <div className="flex-1">
        <PostShow post={selectedPost} />
        <hr className="my-6" />
        <PostList
          posts={posts}
          handleDelete={handleDelete}
          handleSelectedPost={handleSelectedPost}
        />
      </div>
      <div className="flex flex-col w-[33rem]">
        {!selectedPost && <PostCreate onSubmit={appendPost} />}
        <PostEdit
          post={selectedPost}
          onSubmit={handleUpdatePost}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default Post;
