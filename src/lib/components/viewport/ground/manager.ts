export class Ground {
	generate = () => {
        generateGrid();
        generateNoise();
        generateHeight();
        generateVoxel();
        renderChunk();
    };

    update = () => {
        renderChunk();
    }
}
