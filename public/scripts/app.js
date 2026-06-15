// Client facing scripts here
/* global $, document, location */
$(document).ready(function () {
  $("#main .update").on("click", function (e) {
    e.preventDefault();
    const id = $(this).data("id");
    const url = `properties`;

    $.ajax({
      url: url,
      data: { id: id },
      method: "PUT",
    }).then((res) => {
      if (res === "property sold") {
        location.reload();
      }
    });
  });

  $("#main .delete").on("click", function (e) {
    e.preventDefault();
    const button = $(this);
    const id = button.data("id");
    const url = `/myProperty/${id}/delete`;

    $.ajax({
      url: url,
      method: "DELETE",
      success: () => {
        button.closest(".col").fadeOut();
      },
      error: (error) => {
        console.error(error);
      },
    });
  });
});
