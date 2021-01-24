module.exports = (req, res) => {
  res.render("layout/404", {
    title: "Такой страницы не существует",
  });
};