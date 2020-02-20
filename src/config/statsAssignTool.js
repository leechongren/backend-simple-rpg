const [warriorDefaultHp, thiefDefaultHp, mageDefaultHp] = [40, 30, 25]
const [warriorDefaultMp, thiefDefaultMp, mageDefaultMp] = [10, 20, 30]

const statsAssignTool = (job) => {
    if (job === "Warrior") {
        return [warriorDefaultHp, warriorDefaultMp]
    } else if (job === "Thief") {
        return [thiefDefaultHp, thiefDefaultMp]
    } else {
        return [mageDefaultHp, mageDefaultMp]
    }
}

module.exports = statsAssignTool