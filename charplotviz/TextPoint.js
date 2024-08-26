class Text {
    constructor(title, characters) {
        this.title = title;
        this.characters = characters;
        this.v = new p5.Vector();
        this.color = (255, 255, 255)
        this.show_title = false;
    }

    add_value(character, value) {
        this.characters[character] = value;
    }

    get_value(character) {
        return this[character];
    }

    get_char_location(char_1, char_2) {
        return createVector(map(this.characters[char_1], active_min_x, active_max_x, left_margin, right_margin), map(this.characters[char_2], active_min_y, active_max_y, bottom_margin, top_margin));
    }

    set_location(char_1, char_2) {
        this.v = this.get_char_location(char_1, char_2, max_x, max_y)
    }

    move(char_1, char_2) {
        this.v = p5.Vector.lerp(this.v, this.get_char_location(char_1, char_2), .05);
    }

    draw() {
        noStroke();
        fill(this.color);
        ellipse(this.v.x, this.v.y, dot_size);
        textAlign(CENTER, CENTER)
        textSize(16)
        fill(textColor)
        if (this.show_title) { text(this.title, this.v.x - 10, this.v.y - 10) }
    }
}

function get_max_val(char, datapoints) {
    return Math.max(...datapoints.map(d => d.characters[char]))
}

function get_min_val(char, datapoints) {
    return Math.min(...datapoints.map(d => d.characters[char]))
}