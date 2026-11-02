// Middleware de autenticação
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Visitante: somente leitura (bloqueia métodos de escrita e telas de cadastro/edição/importação)
function blockViewerWrites(req, res, next) {
  if (req.session.role !== 'visitante') {
    return next();
  }
  const isWriteView = /^\/(novo|editar|importar)(\/|$)/.test(req.path);
  if (req.method !== 'GET' || isWriteView) {
    return res
      .status(403)
      .send(
        'Acesso negado: usuário visitante possui permissão somente de leitura.'
      );
  }
  next();
}

module.exports = isAuthenticated;
module.exports.blockViewerWrites = blockViewerWrites;
