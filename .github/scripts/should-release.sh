#!/usr/bin/env bash
# Decides whether the version in package.json deserves a release.
#
# Releases when there is no tag for this version yet and it is newer than every
# existing v* tag. Writes `release`, `version`, `tag` and `prerelease` to
# $GITHUB_OUTPUT when that is set, and prints them either way.
set -euo pipefail

version=$(node -p "require('./package.json').version")
tag="v$version"
latest=$(git tag --list 'v*' --sort=-v:refname | head -n 1)
latest=${latest#v}

release=true
reason="new version $version"

if git rev-parse -q --verify "refs/tags/$tag" > /dev/null; then
	release=false
	reason="$tag already exists"
elif [ -n "$latest" ]; then
	# sort -V orders version numbers; if ours is not last, it is not the newest.
	newest=$(printf '%s\n%s\n' "$latest" "$version" | sort -V | tail -n 1)
	if [ "$newest" != "$version" ]; then
		release=false
		reason="$version is older than the latest release $latest"
	fi
fi

# 1.2.0-beta.1 and friends become pre-releases.
prerelease=false
case "$version" in *-*) prerelease=true ;; esac

echo "release=$release ($reason)"
echo "version=$version tag=$tag prerelease=$prerelease"

if [ -n "${GITHUB_OUTPUT:-}" ]; then
	{
		echo "release=$release"
		echo "version=$version"
		echo "tag=$tag"
		echo "prerelease=$prerelease"
	} >> "$GITHUB_OUTPUT"
fi
