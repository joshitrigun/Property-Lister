// Client facing scripts here
$(document).ready(function () {
  $("div .property-card").on("click", function (e) {
    const id = $(this).attr("id");
    window.location.href = `http://localhost:8080/properties/${id}`;
  });
});
