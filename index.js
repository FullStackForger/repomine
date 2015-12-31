'use strict'
var
	async = require('async'),
	fs = require('fs'),
	path = require('path'),
	simpleGit = require('simple-git'),
	verifyPath = require('verify-path'),
	internal = {};

/**
 * Verifies target path and then clones or fast forwards repositories.
 * Returns promise that should always resolve.
 * If errors occur settings object will be decorated with properties:
 * - ready = {bool}
 * - error = {null} | {string}
 *
 * @param settings
 * @param {string} settings.path
 * @param {array} settings.repos
 * @returns {Promise}
 */
exports.update = function (settings) {
	return verifyPath(settings)
		.then(internal.updateRepositories)
}

internal.updateRepositories = function (settings) {
	let updateTime = Date.now();

	return new Promise((resolve, reject) => {
		if (settings.repos == undefined || !settings.repos instanceof Array) {
			reject(new Error('Bad configuration, repos property couldn\'t be found'));
		}

		async.parallel(settings.repos.map((page) => {

			return (callback) => {
				let repoPath = path.resolve(process.cwd(), settings.path, page.dir)

				function onReject(err) {
					page.ready = false
					page.error = err
					callback(null, page)
				}

				function onResolve() {
					page.ready = true
					page.error = null
					callback(null, page)
				}

				if (page.ignore) return onReject(new Error("Repository was ignored"))

				// check if directory exist
				fs.stat(repoPath, (error, stats) => {

					// clone repo if directory doesn't exist
					if (error) {
						return simpleGit().clone(page.git, repoPath, (err) => {
								return err ? onReject(err) : onResolve()
							})
					}

					// check if repo dir is writable
					let mapped = false
					fs.access(repoPath, fs.F_OK | fs.R_OK | fs.W_OK, (error) => {
						if (error) {
							onReject(error)
							mapped = true
						}
					})
					if (mapped) return

					simpleGit(repoPath).pull((err, update) => {
						if (err) return onReject(err)
						page.update = update
						onResolve()
					})
				})
			}
		}), (error, results) => {
			if (error) return reject(error)

			settings.updateTime = updateTime
			settings.updateDuration = Date.now() - updateTime
			resolve(settings)
		})
	})
}


