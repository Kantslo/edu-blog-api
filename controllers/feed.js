export const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "First post",
        content: "This is a first post!",
        imageUrl: "images/UFC-belt.jpg",
      },
    ],
  });
};

export const createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Post created successfully",
    post: { id: new Date().toISOString(), title, content },
  });
};
