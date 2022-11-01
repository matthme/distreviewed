
import test from 'node:test';
import assert from 'node:assert';

import { runScenario, pause } from '@holochain/tryorama';
import { ActionHash, Record } from '@holochain/client';
import { decode } from '@msgpack/msgpack';


test('create review', async t => {
  await runScenario(async scenario => {

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/' + "../workdir/distreviewed.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();
    
    const alice_distreview_cell = alice.cells.find(c => c.role_id === 'distreview');
    if (!alice_distreview_cell) throw new Error("No cell for role id distreview was found");

    const bob_distreview_cell = bob.cells.find(c => c.role_id === 'distreview');
    if (!bob_distreview_cell) throw new Error("No cell for role id distreview was found");
    


    const createInput = {
  review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.'
};

    // Alice creates a review
    const record: Record = await alice_distreview_cell.callZome({
      zome_name: "reviews",
      fn_name: "create_review",
      payload: createInput,
    });
    assert.ok(record);

  });
});

test('create and read review', async t => {
  await runScenario(async scenario => {

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/' + "../workdir/distreviewed.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();
    
    const alice_distreview_cell = alice.cells.find(c => c.role_id === 'distreview');
    if (!alice_distreview_cell) throw new Error("No cell for role id distreview was found");

    const bob_distreview_cell = bob.cells.find(c => c.role_id === 'distreview');
    if (!bob_distreview_cell) throw new Error("No cell for role id distreview was found");
    

    const createInput: any = {
  review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.'
};

    // Alice creates a review
    const record: Record = await alice_distreview_cell.callZome({
      zome_name: "reviews",
      fn_name: "create_review",
      payload: createInput,
    });
    assert.ok(record);
    
    // Wait for the created entry to be propagated to the other node.
    await pause(300);

    // Bob gets the created review
    const createReadOutput: Record = await bob_distreview_cell.callZome({
      zome_name: "reviews",
      fn_name: "get_review",
      payload: record.signed_action.hashed.hash,
    });
    assert.deepEqual(createInput, decode((createReadOutput.entry as any).Present.entry) as any);
  });
});
test('create and update review', async t => {
  await runScenario(async scenario => {

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/' + "../workdir/distreviewed.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();
    
    const alice_distreview_cell = alice.cells.find(c => c.role_id === 'distreview');
    if (!alice_distreview_cell) throw new Error("No cell for role id distreview was found");

    const bob_distreview_cell = bob.cells.find(c => c.role_id === 'distreview');
    if (!bob_distreview_cell) throw new Error("No cell for role id distreview was found");
    

    const createInput = {
  review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.'
};

    // Alice creates a review
    const record: Record = await alice_distreview_cell.callZome({
      zome_name: "reviews",
      fn_name: "create_review",
      payload: createInput,
    });
    assert.ok(record);
 
    // Alice updates the review
    const contentUpdate: any = {
  review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.'
};

    const updateInput = {
      original_action_hash: record.signed_action.hashed.hash,
      updated_review: contentUpdate,
    };

    const updatedRecord: Record = await alice_distreview_cell.callZome({
      zome_name: "reviews",
      fn_name: "update_review",
      payload: updateInput,
    });
    assert.ok(updatedRecord);


    // Wait for the updated entry to be propagated to the other node.
    await pause(300);
        
    // Bob gets the updated review
    const readUpdatedOutput: Record = await bob_distreview_cell.callZome({
      zome_name: "reviews",
      fn_name: "get_review",
      payload: updatedRecord.signed_action.hashed.hash,
    });
    assert.deepEqual(contentUpdate, decode((readUpdatedOutput.entry as any).Present.entry) as any);

  });
});
test('create and delete review', async t => {
  await runScenario(async scenario => {

    // Construct proper paths for your app.
    // This assumes app bundle created by the `hc app pack` command.
    const testAppPath = process.cwd() + '/' + "../workdir/distreviewed.happ";

    // Set up the array of DNAs to be installed, which only consists of the
    // test DNA referenced by path.
    const app = { appBundleSource: { path: testAppPath } };

    // Add 2 players with the test DNA to the Scenario. The returned players
    // can be destructured.
    const [alice, bob] = await scenario.addPlayersWithHappBundles([app, app]);

    // Shortcut peer discovery through gossip and register all agents in every
    // conductor of the scenario.
    await scenario.shareAllAgents();
    
    const alice_distreview_cell = alice.cells.find(c => c.role_id === 'distreview');
    if (!alice_distreview_cell) throw new Error("No cell for role id distreview was found");

    const bob_distreview_cell = bob.cells.find(c => c.role_id === 'distreview');
    if (!bob_distreview_cell) throw new Error("No cell for role id distreview was found");
    

    const createInput = {
  review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec eros quis enim hendrerit aliquet.'
};

    // Alice creates a review
    const record: Record = await alice_distreview_cell.callZome({
      zome_name: "reviews",
      fn_name: "create_review",
      payload: createInput,
    });
    assert.ok(record);
        
    // Alice deletes the review
    const deleteActionHash = await alice_distreview_cell.callZome({
      zome_name: "reviews",
      fn_name: "delete_review",
      payload: record.signed_action.hashed.hash,
    });
    assert.ok(deleteActionHash);


    // Wait for the entry deletion to be propagated to the other node.
    await pause(300);
        
    // Bob tries to get the deleted review
    const readDeletedOutput = await bob_distreview_cell.callZome({
      zome_name: "reviews",
      fn_name: "get_review",
      payload: record.signed_action.hashed.hash,
    });
    assert.equal(readDeletedOutput, undefined);

  });
});