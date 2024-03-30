const tools = document.querySelector("#tools");
const tool_one = document.querySelector("#tool-one");
const tool_two = document.querySelector("#tool-two");
const tool_three = document.querySelector("#tool-three");

function clear() {
    tool_one.classList.remove("active");
    tool_two.classList.remove("active");
    tool_three.classList.remove("active");
}

tool_one.addEventListener("click", () => {
    clear();
    tool_one.classList.add("active");
})

tool_two.addEventListener("click", () => {
    clear();
    tool_two.classList.add("active");
})

tool_three.addEventListener("click", () => {
    clear();
    tool_three.classList.add("active");
})