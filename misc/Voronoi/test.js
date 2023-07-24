function centroid(vertices) {
	const num_vertices = vertices.length;
	let sum_x = 0;
	let sum_y = 0;
	let sum_cp = 0;
	for (let i = 0; i < num_vertices;i++){
		const current_vertex = vertices[i];
		const next_vertex = vertices[(i + 1) % num_vertices];
		const cross_product = (current_vertex[0] * next_vertex[1]) - (next_vertex[0] * current_vertex[1]);
		sum_x += (current_vertex[0] + next_vertex[0]) * cross_product;
		sum_y += (current_vertex[1] + next_vertex[1]) * cross_product;
		sum_cp += cross_product;
  }
	const area = sum_cp/2;
	const centroid_x = sum_x / (6 * area)
	const centroid_y = sum_y / (6 * area)
	return [centroid_x, centroid_y];
}