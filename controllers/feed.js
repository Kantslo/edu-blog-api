export const getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First post",
        content: "This is a first post!",
        imageUrl: "images/UFC-belt.jpg",
        creator: {
          name: "Giorgi",
        },
        createdAt: new Date(),
      },
    ],
  });
};

export const createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  res.status(201).json({
    message: "Post created successfully",
    post: {
      _id: new Date().toISOString(),
      title,
      content,
      creator: { name: "Giorgi" },
      createdAt: new Date(),
    },
  });
};
