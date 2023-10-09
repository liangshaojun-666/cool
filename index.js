'use strict'
const _baseAngle = Math.PI / 360
const R = 200
let speed = 0.5
let angleX = speed * _baseAngle
let angleY = -speed * _baseAngle
const _focalLength = R * 1.5

function Initialization (options) {
    this.options = options
    this.container = options.container
    this.dataArr = options.data
    this.init()
}

Initialization.prototype.init = function () {
    let len = this.dataArr.length
    let newTags = []

    for (let i = 0; i < len; i++) {
        let angleA = Math.acos((2 * (i + 1) - 1) / len - 1)
        let angleB = angleA * Math.sqrt(len * Math.PI)
        let z = R * Math.cos(angleA)
        let y = R * Math.sin(angleA) * Math.sin(angleB)
        let x = R * Math.sin(angleA) * Math.cos(angleB)
        let color = '#' + Math.floor(Math.random() * 0xffffff).toString(16)
        this.dataArr[i].style.color = color
        let newtag = new Tag(this.dataArr[i], x, y, z, this.options)
        newtag.move()
        newTags.push(newtag)
        this.animate()
    }
    this.newTags = newTags
}

Initialization.prototype.rotateX = function () {
    let cos = Math.cos(angleX)
    let sin = Math.sin(angleX)
    this.newTags.forEach((tag) => {
        let y = tag.y * cos - tag.z * sin
        let z = tag.z * cos + tag.y * sin
        tag.y = y
        tag.z = z
    })
}

Initialization.prototype.rotateY = function () {
    let cos = Math.cos(angleY)
    let sin = Math.sin(angleY)
    this.newTags.forEach((tag) => {
        let x = tag.x * cos - tag.z * sin
        let z = tag.z * cos + tag.x * sin
        tag.x = x
        tag.z = z
    })
}

Initialization.prototype.animate = function () {
    let that = this
    setInterval(function () {
        that.rotateX()
        that.rotateY()
        that.newTags.forEach((tag) => {
            tag.move()
        })
    }, 20)
}

function Tag (data, x, y, z, options) {
    this.options = options
    this.dataArr = options.data
    this.data = data
    this.x = x
    this.y = y
    this.z = z
}

Tag.prototype.move = function () {
    let scale = _focalLength / (_focalLength - this.z)
    let alpha = (this.z + R) / (2 * R)

    this.data.style.left = this.x + 'px'
    this.data.style.top = this.y + 'px'
    this.data.style.fontSize = 14 * scale + 'px'
    this.data.style.opacity = alpha + 0.5
}

window.onload = function () {
    let wrap = document.getElementsByClassName('cloud')

    let options = {
        data: wrap[0].getElementsByTagName('a'),
        container: wrap
    }

    let tagCloud = new Initialization(options)

    wrap[0].addEventListener('mousemove', function (e) {
        angleY = 2 * (e.clientX / document.body.getBoundingClientRect().width - 0.5) * speed * _baseAngle
        angleX = 2 * (e.clientY / document.body.getBoundingClientRect().height - 0.5) * speed * _baseAngle
    })
}