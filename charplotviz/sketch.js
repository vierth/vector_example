let left_margin;
let top_margin;
let right_margin;
let bottom_margin;
let max_x;
let max_y;
let active_max_x;
let active_max_y;
let x_axis_val;
let y_axis_val;
let colors;
let titles;
let chinese_titles;
let state;
let dot_size = 10

let textColor = (255, 255, 255)
let backgroundColor = (20, 20, 20)


let axes = [["之", "的"], ["曰","說"], ["了","不"], ["他","我"], ["pc1", "pc2"]];
let active_axis;
let active_axis_index = 0
let show_loadings = false

function setup() {
    createCanvas(windowHeight, windowHeight);
    titles = ["Water Margin", "Three Kingdoms", "Journey to the West", "Plum in Golden Vase"]
    chinese_titles = { "水滸傳": 0, "三國": 1, "西遊記": 2, "金瓶梅": 3 }
    colors = [color(255, 0, 255), color(255, 255, 0), color(0, 255, 255), color(0, 255, 0)]

    left_margin = width / 10;
    top_margin = height / 10;
    right_margin = width - width / 10;
    bottom_margin = height - height / 10;

    active_axis = axes[active_axis_index]

    x_axis_val = "之"
    y_axis_val = "的"



    active_max_x = get_max_val(active_axis[0], chapterdatapoints) * 1.1
    active_max_y = get_max_val(active_axis[1], chapterdatapoints) * 1.1
    active_min_x = get_min_val(active_axis[0], chapterdatapoints) * .9
    active_min_y = get_min_val(active_axis[1], chapterdatapoints) * .9

    // if (active_min_x > 0) {
    //     active_min_x = 0
    // }
    // if (active_min_y > 0) {
    //     active_min_y = 0
    // }

    for (let i = 0; i < datapoints.length; i++) {
        let doc = datapoints[i];
        doc.color = colors[i]
        doc.set_location(active_axis[0], active_axis[1]);
    }

    for (let i = 0; i < chapterdatapoints.length; i++) {
        let doc = chapterdatapoints[i]
        doc.color = colors[chinese_titles[doc.title.split(" ")[0]]]
        doc.set_location(active_axis[0], active_axis[1]);
        // doc.v = datapoints[chinese_titles[doc.title.split(" ")[0]]].v
    }

    state = 2;
}

function draw() {
    background(backgroundColor);
    active_axis = axes[active_axis_index];
    let use_points;
    let use_loadings;
    
    use_points = chapterdatapoints;
    use_loadings = chapter_loadings;
    

    // console.log(active_axis_index)
    max_x = get_max_val(active_axis[0], use_points) * 1.1
    max_y = get_max_val(active_axis[1], use_points) * 1.1
    min_x = get_min_val(active_axis[0], use_points) * 1.1
    min_y = get_min_val(active_axis[1], use_points) * 1.1

    if (min_x > 0) {
        min_x = 0
    }
    if (min_y > 0) {
        min_y = 0
    }


    active_max_x = lerp(active_max_x, max_x, .05)
    active_max_y = lerp(active_max_y, max_y, .05)
    active_min_x = lerp(active_min_x, min_x, .05)
    active_min_y = lerp(active_min_y, min_y, .05)

    if (state == 1) {
        // console.log(use_points[0])
        drawDistance(use_points[2], use_points[3])
    }

    for (let i = 0; i < use_points.length; i++) {
        let doc = use_points[i];
        doc.move(active_axis[0], active_axis[1])
        doc.draw();
    }

    drawMargins();
    drawAxes();
    drawLegend();
    if (show_loadings) {
        drawLoadings(use_loadings);
    }


}

function drawAxes() {
    stroke(textColor)
    line(left_margin, top_margin, left_margin, bottom_margin)
    line(left_margin, bottom_margin, right_margin, bottom_margin)
}

function drawLoadings(use_loadings) {
    noStroke();
    fill(255, 255, 255)

    for (let i = 0; i < "之的說曰了不他我".length; i++) {
        char = "之的說曰了不他我"[i]
        text(char, map(use_loadings[char][0], active_min_x, active_max_x, left_margin, right_margin), map(use_loadings[char][1], active_min_y, active_max_y, bottom_margin, top_margin))
    }



}

function drawDistance(use_point_1, use_point_2) {
    stroke(255, 255, 255);
    line(use_point_1.v.x, use_point_1.v.y, use_point_2.v.x, use_point_2.v.y)
}


function drawMargins() {
    fill(backgroundColor)
    noStroke()
    rect(0, 0, left_margin, height);
    rect(0, bottom_margin, width, bottom_margin);

    let x_val_lab = Math.round(active_max_x * 100) / 100
    let y_val_lab = Math.round(active_max_y * 100) / 100
    let x_val_lab_min = Math.round(active_min_x * 100) / 100
    let y_val_lab_min = Math.round(active_min_y * 100) / 100

    textSize(12);
    fill(textColor);
    textAlign(CENTER)
    text(x_val_lab, right_margin, bottom_margin + 12);
    text(y_val_lab, left_margin, top_margin - 12);
    textAlign(RIGHT)
    text(x_val_lab_min, left_margin + 12, bottom_margin + 12);
    text(y_val_lab_min, left_margin - 12, bottom_margin - 12);
    textSize(24)
    textAlign(CENTER)
    text(active_axis[0], width / 2, bottom_margin + top_margin / 2)
    text(active_axis[1], left_margin - left_margin / 2, height / 2)
}

function drawLegend() {
    for (let i = 0; i < titles.length; i++) {
        // stroke(colors[i]);
        noStroke();
        fill(colors[i])
        textSize(20);
        textAlign(RIGHT);
        text(titles[i], width, ((i + 2) * height / 30) + height / 30);
    }
}


function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        active_axis_index -= 1
    } else if (keyCode === RIGHT_ARROW) {
        active_axis_index += 1
    } else if (keyCode === UP_ARROW) {
        state += 1
    } else if (keyCode === DOWN_ARROW) {
        state -= 1
    } else if (keyCode == 86) {
        dot_size -= 1
    } else if (keyCode == 66) {
        dot_size += 1
    } else if (keyCode == 67) {
        show_loadings = !show_loadings
    }


    if (active_axis_index > axes.length - 1) {
        active_axis_index = 0
    } else if (active_axis_index < 0) {
        active_axis_index = axes.length - 1
    }

    if (state > 2) {
        state = 0
    }

    if (state < 0) {
        state = 2
    }

}
