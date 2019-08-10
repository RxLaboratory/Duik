#ifndef BUILDER_H
#define BUILDER_H

#include <QObject>
#include <QFile>
#include <QRegularExpressionMatch>
#include <QThread>

#include "script.h"

class Builder : public QThread
{
    Q_OBJECT
public:
    Builder();
    /**
     * @brief Sets the current script which has to be built
     * @param s The script
     */
    void setScript(Script *s);

public slots:
    /**
     * @brief Builds the current script
     */
    void run();

signals:
    /**
     * @brief Emitted when the builder finishes
     * @param builtScript The built script (empty string if anything went wrong)
     */
    void built(QString builtScript);

private:
    /**
     * @brief The current script which will be built when run() is called
     */
    Script *script;
    /**
     * @brief Recursive method which builds the scripts and all includes
     * @param s The script to build
     * @return The built script
     */
    QString build(Script *s);
};

#endif // BUILDER_H
