export default class vector2 {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    toString() {
        return "{x:" + this.x + "," + "y:" + this.y + "}"
    }
    add(v2, getnew = false) {
        let x = this.x + v2.x
        let y = this.y + v2.y
        if (getnew) {
            return new vector2(x, y)
        } else {
            this.x = x
            this.y = y
        }
    }
    mul(n, getnew = false) {
        let x = this.x * n
        let y = this.y * n
        if (getnew) {
            return new vector2(x, y)
        } else {
            this.x = x
            this.y = y
        }
    }
    dev(n, getnew = false) {
        let x = this.x / n
        let y = this.y / n
        if (getnew) {
            return new vector2(x, y)
        } else {
            this.x = x
            this.y = y
        }
    }
    clone() {
        return new vector2(this.x, this.y)
    }
    sub(v2, getnew = false) {
        let x = this.x - v2.x
        let y = this.y - v2.y
        if (getnew) {
            return new vector2(x, y)
        } else {
            this.x = x
            this.y = y
        }
    }
    isEqual(p2) {
        return this.x == p2.x && this.y == p2.y
    }
    invert(getnew) {
        let x = -this.x
        let y = -this.y
        if (getnew) {
            return new vector2(x, y)
        } else {
            this.x = x
            this.y = y
        }
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    normalize(getnew = false) {
        let l = this.length()
        let x = this.x / l
        let y = this.y / l
        if (getnew) {
            return new vector2(x, y)
        } else {
            this.x = x
            this.y = y
        }
    }
    dot(v) {
        return this.x * v.x + this.y * v.y
    }
    normalizeDot(v) {
        let v1 = v.normalize(true)
        let v2 = this.normalize(true)
        return v1.x * v2.x + v1.y * v2.y
    }
    cross(v) {
        return this.x * v.y - v.x * this.y
    }
    vertical(v, type = 0) {
        let x = v.y
        let y = v.x
        if (type == 0) {
            x = -x
        } else {
            y = -y
        }
        return vector2(x, y)
    }
    round(getnew = false) {
        let x = Math.round(this.x)
        let y = Math.round(this.y)
        if (getnew) {
            return new vector2(x, y)
        } else {
            this.x = x
            this.y = y
        }
    }
}