function getFrameSize(frameID) {
    var result = {height:0, width:0};
    if (document.getElementById) {
        var frame = parent.document.getElementById(frameID);
        if (frame.scrollWidth) {
            result.height = frame.scrollHeight;
            result.width = frame.scrollWidth;
        }
    }
    return result;
}