let lat, longt, city;
let keyword, distance, category;
let API_KEY_GOOGLE_GEO = "&key=AIzaSyD3ESbx58v5iIzMjYdgfrlwCWKCWiw67Vg";
let data_buffer;
let server_addr = "http://127.0.0.1:5000/";

function business_detail(id){
    let business_id = data_buffer[id - 1]["id"];
    $.get(server_addr + "api/business_detail",
        {
            "business_id": business_id
        } ,
        function (data){
            $("#business_name p").html(data["name"]);
            console.log(data["hours"][0]["is_open_now"]);
            let is_open_now = data["hours"][0]["is_open_now"];
            if(is_open_now === true){
                $("#detail_row_1 #b_status p.detail_content").html("Open Now");
            }
            else{
                $("#detail_row_1 #b_status p.detail_content").html("Closed").css("background", "red");

            }
            let detail_categories = data["categories"];
            if(!detail_categories){
                $("#detail_row_1 #b_category").css("visibility", "hidden");
            }
            else{
                let category_str = "";
                for(let i = 0; i < detail_categories.length; i++){
                    category_str += detail_categories[i]["title"] + " | ";
                    $("#detail_row_1 #b_category p.detail_content").html(category_str.substring(0, category_str.length - 3));
                    $("#detail_row_1 #b_category").css("visibility", "visible");
                }
            }
            let display_address = data["location"]["display_address"];
            if(display_address.length > 0){
                let detail_address_str = "";
                for(let i = 0; i < display_address.length; i++){
                    detail_address_str += display_address[i] + " ";
                }
                $("#detail_row_2 #b_address p.detail_content").html(detail_address_str);
                $("#detail_row_2 #b_address").css("visibility", "visible");
            }
            else{
                $("#detail_row_2 #b_address").css("visibility", "hidden");
            }
            let detail_phone = data["phone"];
            if(detail_phone){
                $("#detail_row_2 #b_phone p.detail_content").html(detail_phone);
                $("#detail_row_2 #b_phone").css("visibility", "visible");
            }
            else{
                console.log("b_phone not found!");
                $("#detail_row_2 #b_phone").css("visibility", "hidden");
            }
            let ts_arr = data["transactions"];
            if(ts_arr.length > 0){
                let detail_ts = "";
                for(let i = 0; i < ts_arr.length; i++){
                    detail_ts += ts_arr[i] + ", ";
                }
                $("#detail_row_3 #b_ts p.detail_content").html(detail_ts.substring(0, detail_ts.length - 2));
                $("#detail_row_3 #b_ts").css("visibility", "visible");
            }
            else {
                $("#detail_row_3 #b_ts").css("visibility", "hidden");
            }
            let detail_price = data["price"];
            if(detail_price){
                $("#detail_row_3 #b_price p.detail_content").html(detail_price);
                $("#detail_row_3 #b_price").css("visibility", "visible");
            }
            else{
                $("#detail_row_3 #b_price").css("visibility", "hidden");
            }
            let detail_moreinfo = data["url"];
            if(detail_moreinfo){
                $("#detail_row_4 #b_moreInfo p.detail_content a").attr("href", detail_moreinfo);
                $("#detail_row_4 #b_moreInfo").css("visibility", "visible");
            }
            else {
                $("#detail_row_4 #b_moreInfo").css("visibility", "hidden");
            }
            let detail_photo_url = data["photos"];
            console.log(detail_photo_url);
            if(detail_photo_url.length > 0){
                for(let i = 0; i < 3; i++){
                    if(i < detail_photo_url.length){
                        $("#b_img" + (i + 1) + " img").attr("src", detail_photo_url[i]);
                        $("#b_img" + (i + 1)).css("visibility", "visible");
                    }
                    else{
                        $("#b_img" + (i + 1)).css("visibility", "hidden");
                    }
                }
            }
            else{
                $("#row_5_table").hide();
            }

            $("#business_detail").show();
            console.log(data);
        }
    );
}

function get_businesses(){
    $.get(server_addr + "api/business_search",
        {
            "keyword": keyword,
            "distance": distance * 1600,
            "category": category,
            "lat": lat,
            "lng": longt
        },
        function(data){
            if(data['total'] === 0){
                alert("NO RESULT FOUND! Please change search input!");
            }
            else{
                console.log(data);
                let tmp;
                for(let i = 0; i < Math.min(data["total"], 20); i++){
                    if(i === 0){
                        $("tr#title_row").show();
                    }
                    tmp = "#content_row_" + (i + 1);
                    $(tmp).show();
                    $(tmp + " .content_No span").html(i + 1);
                    $(tmp + " .content_Image img").attr("src", data["businesses"][i]["image_url"]);
                    // $(tmp + " .content_Business a").attr("href", "http://127.0.0.1:5000/");
                    $(tmp + " .content_Business span").html(data["businesses"][i]["name"]);
                    $(tmp + " .content_Rating span").html(data["businesses"][i]["rating"]);
                    $(tmp + " .content_Distance span").html((data["businesses"][i]["distance"] / 1600).toFixed(2));
                    // $(tmp).find(".content_No").each(function (){
                    //     $(this).find("span").html("3");
                    // });
                    console.log($(tmp + " .content_No span").html());
                }
                data_buffer = data["businesses"].splice(0, Math.min(data["total"], 20));
                console.log(data_buffer);

            }
            // console.log("Business js func triggered!");
        }
    );
    return "Business js func triggered!";
}

function geo_google(address){
    // let loc = "1600 Amphitheatre Parkway, Mountain View, CA";

    if($("input#autoGeoDetectBox").is(':checked')){
        console.log("ADDR AUTO DETECTED.");
        get_businesses();
    }
    else{
        let search_address = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        address = address.replace(" ", "+");
        let url = search_address + address + API_KEY_GOOGLE_GEO;
        console.log('Request url: ' + url);

        $.getJSON(url, function (data){
            // console.log(data);
            if(data['status'] === "ZERO_RESULTS") alert("Location error! Make sure you input a valid location!");
            else{
                lat = data['results'][0]['geometry']['location']['lat'];
                longt = data['results'][0]['geometry']['location']['lng'];
                get_businesses();
            }

        });
    }
}

function business_search() {

    keyword = $("#KeyWord").val();
    distance = $("#Distance").val();
    category = $("#Category").val();
    let address = $("#Location").val();
    if(keyword && address){
        geo_google(address);
    }


}

function auto_detect_geo() {
    $.getJSON('http://ipinfo.io?token=1af2048e117f21', function(data){
        console.log(data);
        let geo_loc = data['loc'].split(",");
        city = data['city'];
        $("#Location").val(city);
        lat = geo_loc[0];
        longt = geo_loc[1];
    });
}



function clearAll(){
    $("#KeyWord").val('');
    $("#Category").val(1);
    $("#Distance").val('');
    $("#Location").val('');
}