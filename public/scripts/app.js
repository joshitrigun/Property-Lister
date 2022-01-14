// Client facing scripts here
$(document).ready(function () {
  $(".property-card").on("click", function (e) {
    const id = $(this).attr("id");
    window.location.href = `http://localhost:8080/properties/${id}`;
  });

  $("#message-submit-btn").on("click", function (e) {
    e.preventDefault();
    $(".message-text").val("");
    $(".success-message").text("Message Sent!");
  });

  $("#main .delete").each((element) => {
    element = $("#main .delete")[element];
    console.log("element", element);
    $(element).click(function (e) {
      console.log("I am here inside");
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
