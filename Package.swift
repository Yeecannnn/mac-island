// swift-tools-version: 6.2
import PackageDescription

let package = Package(
    name: "MacDynamicIsland",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(name: "MacDynamicIsland", targets: ["MacDynamicIsland"])
    ],
    targets: [
        .executableTarget(
            name: "MacDynamicIsland",
            path: "Sources/MacDynamicIsland"
        )
    ]
)
