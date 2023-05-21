{ pkgs }: {
	deps = [
		pkgs.clang_12
		pkgs.ccls
		pkgs.gdb
		pkgs.gnumake
    pkgs.rustc
		pkgs.rustfmt
		pkgs.cargo
		pkgs.cargo-edit
    pkgs.rust-analyzer
    pkgs.graalvm17-ce
    pkgs.maven
    pkgs.replitPackages.jdt-language-server
    pkgs.replitPackages.java-debug
    pkgs.nodejs-18_x
		pkgs.nodePackages.typescript-language-server
		pkgs.yarn
		pkgs.replitPackages.jest
    pkgs.python310Full
    pkgs.replitPackages.prybar-python310
    pkgs.replitPackages.stderred
    pkgs.jq.bin
    pkgs.dotnet-sdk
    pkgs.omnisharp-roslyn
	];
}
