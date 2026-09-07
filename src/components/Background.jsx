import React from "react"

const AnimatedBackground = () => {
	return (
		<div className="fixed inset-0 bg-white">
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-[linear-gradient(to_right,#00000009_1px,transparent_1px),linear-gradient(to_bottom,#00000009_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_10%,transparent_70%)]"
			/>
		</div>
	)
}

export default AnimatedBackground
