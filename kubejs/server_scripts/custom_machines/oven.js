ServerEvents.recipes((event) => {
    let bread = event.recipes.pack.baking();
    bread.id("pack:bread");
    bread.duration(400);
    bread.inputItems("farmersdelight:wheat_dough");
    bread.outputItems(["minecraft:bread"]);
    bread.priority(8);

    let cake = event.recipes.pack.baking();
    cake.id("pack:cake");
    cake.duration(600);
    cake.inputItems([
        "farmersdelight:wheat_dough",
        "minecraft:sugar",
        "minecraft:sweet_berries",
    ]);
    cake.outputItems(["minecraft:cake"]);
    cake.priority(7);
});

/**
 *
 * @param {Internal.MBDMachine} machine
 * @returns
 */
function ovenIsHeated(machine) {
    let block = machine.level.getBlock(machine.pos.below());

    if (block.hasTag("minecraft:campfires")) {
        return block.properties.get("lit") === "true";
    }

    if (block.id === "create:lit_blaze_burner") {
        var heat = machine
            .getLevel()
            .getBlockEntity(dir)
            .saveWithId()
            .get("fuelLevel");
        return heat > 1;
    }

    if (block.hasTag("farmersdelight:heat_sources")) {
        return true;
    }

    return false;
}

MBDMachineEvents.onNeighborChanged("pack:oven", (event) => {
    var machine = event.getEvent().getMachine();

    if (ovenIsHeated(machine)) {
        machine.setMachineState("heated");
    } else {
        machine.setMachineState("base");
    }
});

MBDMachineEvents.onRecipeWorking("pack:oven", (event) => {
    if (event.event.machine.getMachineState().name() !== "heated") {
        event.event.setCanceled(true);
    }
});

MBDMachineEvents.onStateChanged("pack:oven", (event) => {
    let { machine, newState } = event.event;
    if (newState === "base" && ovenIsHeated(machine)) {
        event.event.setCanceled(true);
    }
});
