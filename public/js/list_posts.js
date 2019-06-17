console.log("sadsad");

$(document).ready(() => {
    console.log("sadsad");
    const listPost = $("#pagination-post").html();
    const complitelisPost = Handlebars.compile(listPost);
    $(".pagination").html(complitelisPost);
});
