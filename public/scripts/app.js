// Client facing scripts here
$(document).ready(function () {
  $(".property-card").on("click", function (e) {
    const id = $(this).attr("id");
    window.location.href = `http://localhost:8080/properties/${id}`;
  });

<<<<<<< HEAD
=======
  $("#main .update").on("click", function (e) {
    e.preventDefault();

    $(".property-card").off("click");
    //console.log("I am clicked");
    const id = $(this).data("id");
    const url = `properties`;
    console.log(id);
    $.ajax({
      url: url,
      data: { id: id },
      method: "PUT",
    }).then((res) => {
      //console.log({ res });
      //console.log($(e.currentTarget).parents()[4]);
      // console.log($($(e.currentTarget).parents()[3]).children().first()[0]);
      //console.log($($($(e.currentTarget).parents()[3]).children().first()[0]));

      console.log($($(e.currentTarget).parents()[3]));
      let imgEl = $($(e.currentTarget).parents()[3]).children().first()[0];
      console.log(imgEl);
      $(e.currentTarget).closest("div.card").find(imgEl).fadeOut();
      window.location.href = `http://localhost:8080/properties/`;
      console.log($(e.currentTarget).closest("div.card").find(imgEl));

      // css({
      //   "background-color": "red",
      //   opacity: "50%",
      // });
    });

    //   $.ajax({
    //     url: url,
    //     data: { id: id },
    //     method: "PUT",
    //     success: (res) => {
    //       console.log({ res });
    //       console.log($(".property-card"));
    //       $(".property-card").closest(".").blur();
    //       // css({
    //       //   "background-color": "red",
    //       //   opacity: "50%",
    //       // });
    //     },
    //     error: (error) => {
    //       console.log(error);
    //     },
    //   });
  });

>>>>>>> a0799e2de74bb04df8237f279df44750bd74887a
  $("#main .delete").each((element) => {
    element = $("#main .delete")[element];
    console.log("element", element);
    $(element).click(function (e) {
      //console.log("I am here inside");
      e.preventDefault();
      const id = $(this).data("id");
      const url = `/myProperty/${id}/delete`;

      $.ajax({
        url: url,
        method: "DELETE",
        success: (res) => {
          console.log(res);
          $(element).closest(".col-4").fadeOut();
        },
        error: (error) => {
          console.error(error);
        },
      });
    });
  });
});
